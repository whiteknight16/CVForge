// Resume customization constants

export interface Template {
  id: string
  name: string
  style: string
  description?: string
}

export interface Font {
  id: string
  name: string
  family: string
  category: 'serif' | 'sans-serif'
}

export interface Theme {
  id: string
  name: string
  textColor: string
  bgColor: string
}

// Template definitions with distinct styles
export const templates: Template[] = [
  { 
    id: 'melitta', 
    name: 'Melitta Bentz', 
    style: 'classic',
    description: 'Centered headers with clean borders'
  },
  { 
    id: 'modern', 
    name: 'Modern', 
    style: 'modern',
    description: 'Left-aligned with accent borders'
  },
  { 
    id: 'grace', 
    name: 'Grace Hopper', 
    style: 'professional',
    description: 'Two-column layout with sidebar'
  },
  { 
    id: 'shakespeare', 
    name: 'William Shakespeare', 
    style: 'elegant',
    description: 'Elegant centered with double borders'
  },
  { 
    id: 'feynman', 
    name: 'Richard Feynman', 
    style: 'academic',
    description: 'Academic style with minimal borders'
  },
  { 
    id: 'ampere', 
    name: 'André-Marie Ampère', 
    style: 'creative',
    description: 'Creative with dashed borders'
  },
  { 
    id: 'minimal', 
    name: 'Minimal', 
    style: 'minimal',
    description: 'Ultra-clean with no borders'
  },
  { 
    id: 'executive', 
    name: 'Executive', 
    style: 'executive',
    description: 'Bold headers with strong accents'
  },
]

// Font options
export const fonts: Font[] = [
  { id: 'times', name: 'Times New Roman', family: 'Times New Roman', category: 'serif' },
  { id: 'verdana', name: 'Verdana', family: 'Verdana', category: 'sans-serif' },
  { id: 'georgia', name: 'Georgia', family: 'Georgia', category: 'serif' },
  { id: 'arial', name: 'Arial', family: 'Arial', category: 'sans-serif' },
  { id: 'helvetica', name: 'Helvetica', family: 'Helvetica', category: 'sans-serif' },
  { id: 'garamond', name: 'Garamond', family: 'Garamond', category: 'serif' },
]

// Theme options - all with white background, only text color changes
export const themes: Theme[] = [
  { id: 'classic', name: 'Classic Black', textColor: '#000000', bgColor: '#ffffff' },
  { id: 'slate', name: 'Corporate Gray', textColor: '#334155', bgColor: '#ffffff' },
  { id: 'blue', name: 'Professional Blue', textColor: '#1e3a8a', bgColor: '#ffffff' },
  { id: 'teal', name: 'Modern Teal', textColor: '#115e59', bgColor: '#ffffff' },
  { id: 'green', name: 'Fresh Green', textColor: '#166534', bgColor: '#ffffff' },
]

