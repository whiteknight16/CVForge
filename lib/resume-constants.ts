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
  { id: 'verdana', name: 'Verdana', family: 'Verdana, sans-serif', category: 'sans-serif' },
  { id: 'georgia', name: 'Georgia', family: 'Georgia, serif', category: 'serif' },
  { id: 'garamond', name: 'Garamond', family: 'Garamond, serif', category: 'serif' },
  { id: 'arial', name: 'Arial', family: 'Arial, sans-serif', category: 'sans-serif' },
  { id: 'times', name: 'Times New Roman', family: '"Times New Roman", serif', category: 'serif' },
  { id: 'helvetica', name: 'Helvetica', family: 'Helvetica, sans-serif', category: 'sans-serif' },
]

// Theme options - some change only text, some change both text and background
export const themes: Theme[] = [
  { id: 'classic', name: 'Classic', textColor: '#000000', bgColor: '#ffffff' },
  { id: 'blue', name: 'Blue', textColor: '#2563eb', bgColor: '#ffffff' },
  { id: 'teal', name: 'Teal', textColor: '#14b8a6', bgColor: '#ffffff' },
  { id: 'green', name: 'Green', textColor: '#16a34a', bgColor: '#ffffff' },
  { id: 'warm', name: 'Warm', textColor: '#dc2626', bgColor: '#fef2f2' },
  { id: 'cool', name: 'Cool', textColor: '#0891b2', bgColor: '#ecfeff' },
  { id: 'dark', name: 'Dark', textColor: '#ffffff', bgColor: '#1e293b' },
  { id: 'elegant', name: 'Elegant', textColor: '#475569', bgColor: '#f8fafc' },
  { id: 'bold', name: 'Bold', textColor: '#000000', bgColor: '#fef3c7' },
]

