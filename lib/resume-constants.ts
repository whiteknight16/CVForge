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
    name: 'Classic', 
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
    name: 'Professional', 
    style: 'professional',
    description: 'Two-column layout'
  },
  { 
    id: 'shakespeare', 
    name: 'Elegant', 
    style: 'elegant',
    description: 'Centered with double borders'
  },
  { 
    id: 'feynman', 
    name: 'Academic', 
    style: 'academic',
    description: 'Minimal borders'
  },
  { 
    id: 'ampere', 
    name: 'Creative', 
    style: 'creative',
    description: 'Dashed borders'
  },
  { 
    id: 'minimal', 
    name: 'Minimal', 
    style: 'minimal',
    description: 'No borders'
  },
  { 
    id: 'executive', 
    name: 'Executive', 
    style: 'executive',
    description: 'Bold headers'
  },
  { 
    id: 'compact', 
    name: 'Compact', 
    style: 'compact',
    description: 'Space-efficient'
  },
  { 
    id: 'traditional', 
    name: 'Traditional', 
    style: 'traditional',
    description: 'Classic serif'
  },
  { 
    id: 'tech', 
    name: 'Tech', 
    style: 'tech',
    description: 'Modern tech style'
  },
  { 
    id: 'serif', 
    name: 'Serif', 
    style: 'serif',
    description: 'Traditional serif'
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

