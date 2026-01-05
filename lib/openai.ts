/**
 * Generate professional summary using OpenAI API based on all resume data
 * @param resumeData - All resume data including personal details, skills, experience, education, projects, etc.
 * @returns Generated professional summary string
 */
export async function generateProfessionalSummary(resumeData: any): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OpenAI API key not found. Please add OPENAI_API_KEY to your .env file.')
  }

  // Build comprehensive context from all resume data
  let context = ''

  // Personal Details
  if (resumeData.personal_details) {
    const pd = resumeData.personal_details
    context += `Personal Information:\n`
    context += `- Name: ${pd.name || 'N/A'}\n`
    context += `- Email: ${pd.email || 'N/A'}\n`
    if (pd.phone) context += `- Phone: ${pd.phone}\n`
    if (pd.city && pd.state) context += `- Location: ${pd.city}, ${pd.state}\n`
    context += `\n`
  }

  // Skills
  if (Array.isArray(resumeData.skills) && resumeData.skills.length > 0) {
    context += `Skills: ${resumeData.skills.join(', ')}\n\n`
  }

  // Employment History
  if (Array.isArray(resumeData.employment_history) && resumeData.employment_history.length > 0) {
    context += `Work Experience:\n`
    resumeData.employment_history.forEach((job: any, index: number) => {
      context += `${index + 1}. ${job.position || 'N/A'} at ${job.company_name || 'N/A'}`
      if (job.start_date) {
        context += ` (${job.start_date}${job.end_date ? ` - ${job.end_date}` : ' - Present'})`
      }
      context += `\n`
      if (job.description) context += `   ${job.description}\n`
    })
    context += `\n`
  }

  // Education
  if (Array.isArray(resumeData.education) && resumeData.education.length > 0) {
    context += `Education:\n`
    resumeData.education.forEach((edu: any, index: number) => {
      context += `${index + 1}. ${edu.degree || 'N/A'} in ${edu.field_of_study || 'N/A'} from ${edu.school_name || 'N/A'}`
      if (edu.start_date) {
        context += ` (${edu.start_date}${edu.end_date ? ` - ${edu.end_date}` : ''})`
      }
      context += `\n`
      if (edu.description) context += `   ${edu.description}\n`
    })
    context += `\n`
  }

  // Projects
  if (Array.isArray(resumeData.projects) && resumeData.projects.length > 0) {
    context += `Projects:\n`
    resumeData.projects.forEach((project: any, index: number) => {
      context += `${index + 1}. ${project.project_name || 'N/A'}`
      if (Array.isArray(project.technologies) && project.technologies.length > 0) {
        context += ` (Technologies: ${project.technologies.join(', ')})`
      }
      context += `\n`
      if (project.description) context += `   ${project.description}\n`
    })
    context += `\n`
  }

  // Languages
  if (Array.isArray(resumeData.languages) && resumeData.languages.length > 0) {
    context += `Languages: ${resumeData.languages.map((lang: any) => `${lang.language} (${lang.proficiency})`).join(', ')}\n\n`
  }

  const prompt = `Based on the following resume information, generate a professional summary (2-4 sentences) that highlights the candidate's key qualifications, experience, and strengths. Make it compelling and tailored to their background.

${context}

Generate a professional summary that:
- Highlights their key qualifications and experience
- Mentions relevant skills and expertise
- Shows their career progression or focus
- Is concise (2-4 sentences)
- Is professional and impactful`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional resume writer. Generate compelling professional summaries that highlight a candidate\'s strengths and experience.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 200,
        temperature: 0.5,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to generate professional summary')
    }

    const data = await response.json()
    return data.choices[0]?.message?.content?.trim() || 'Failed to generate professional summary'
  } catch (error: any) {
    console.error('OpenAI API error:', error)
    throw new Error(error.message || 'Failed to generate professional summary. Please try again.')
  }
}

/**
 * Generate description using OpenAI API
 * @param context - The context information (job, education, or project details)
 * @param type - The type of description: 'employment', 'education', or 'project'
 * @returns Generated description string
 */
export async function generateDescription(
  context: any,
  type: 'employment' | 'education' | 'project'
): Promise<string> {
  // TODO: Add your OpenAI API key to .env file as OPENAI_API_KEY
  const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OpenAI API key not found. Please add OPENAI_API_KEY to your .env file.')
  }

  let prompt = ''

  if (type === 'employment') {
    prompt = `Generate a professional job description for a resume based on the following information:
- Company: ${context.company_name || 'N/A'}
- Position: ${context.position || 'N/A'}
- Start Date: ${context.start_date || 'N/A'}
- End Date: ${context.end_date || 'Present'}
- Type: ${context.type || 'full-time'}

Generate 3-5 bullet points describing key responsibilities and achievements. Make it professional and impactful.`
  } else if (type === 'education') {
    prompt = `Generate a professional education description for a resume based on the following information:
- School: ${context.school_name || 'N/A'}
- Degree: ${context.degree || 'N/A'}
- Field of Study: ${context.field_of_study || 'N/A'}
- Start Date: ${context.start_date || 'N/A'}
- End Date: ${context.end_date || 'N/A'}

Generate 2-3 sentences describing relevant coursework, achievements, or highlights. Make it professional and concise.`
  } else if (type === 'project') {
    prompt = `Generate a professional project description for a resume based on the following information:
- Project Name: ${context.project_name || 'N/A'}
- Technologies: ${Array.isArray(context.technologies) ? context.technologies.join(', ') : 'N/A'}

Generate 3-4 sentences describing the project, its purpose, key features, and technologies used. Make it professional and highlight technical achievements.`
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional resume writer. Generate concise, impactful descriptions for resumes.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to generate description')
    }

    const data = await response.json()
    return data.choices[0]?.message?.content?.trim() || 'Failed to generate description'
  } catch (error: any) {
    console.error('OpenAI API error:', error)
    throw new Error(error.message || 'Failed to generate description. Please try again.')
  }
}

/**
 * Parse resume text and extract structured information using OpenAI API
 * @param text - Raw text extracted from resume (PDF or DOCX)
 * @returns Structured resume data object
 */
export async function parseResumeText(text: string): Promise<any> {
  const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OpenAI API key not found. Please add OPENAI_API_KEY to your .env file.')
  }

  const prompt = `You are a resume parser. Extract structured information from the following resume text and return it as a JSON object. Be thorough and extract all available information.

Expected JSON structure:
{
  "personal_details": {
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "phone number",
    "address": "full address",
    "city": "city",
    "state": "state",
    "zip": "zip code",
    "country": "country"
  },
  "professional_summary": "Professional summary or objective statement",
  "employment_history": [
    {
      "company_name": "Company Name",
      "position": "Job Title",
      "start_date": "YYYY-MM",
      "end_date": "YYYY-MM or Present",
      "description": "Job responsibilities and achievements",
      "type": "full-time/part-time/freelance/internship/volunteer"
    }
  ],
  "education": [
    {
      "school_name": "School Name",
      "degree": "Degree",
      "field_of_study": "Field of Study",
      "start_date": "YYYY-MM",
      "end_date": "YYYY-MM",
      "description": "Additional details"
    }
  ],
  "projects": [
    {
      "project_name": "Project Name",
      "description": "Project description",
      "technologies": ["tech1", "tech2"],
      "links": {"github": "url", "demo": "url"}
    }
  ],
  "skills": ["skill1", "skill2", "skill3"],
  "languages": [{"language": "English", "proficiency": "Native/Fluent/Intermediate/Basic"}],
  "links": {"linkedin": "url", "github": "url", "portfolio": "url", "website": "url"}
}

Important:
- Only include fields that are present in the resume
- For missing fields, use null or empty array
- Dates should be in YYYY-MM format
- Be accurate and don't make up information
- Extract ALL work experience, education, projects, and skills

Resume text:
${text}

Return ONLY the JSON object, no markdown formatting or explanations.`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a precise resume parser. Return only valid JSON, no markdown or explanations.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to parse resume')
    }

    const data = await response.json()
    const parsedData = data.choices[0]?.message?.content

    if (!parsedData) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    return JSON.parse(parsedData)
  } catch (error: any) {
    console.error('OpenAI API error:', error)
    throw new Error(error.message || 'Failed to parse resume. Please try again.')
  }
}

