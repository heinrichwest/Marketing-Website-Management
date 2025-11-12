"use client"

interface FilterOption {
  id: string
  label: string
  icon?: string
}

interface FilterSidebarProps {
  categories: FilterOption[]
  onCategoryChange: (category: string) => void
  selectedCategory: string
}

export function FilterSidebar({ categories, onCategoryChange, selectedCategory }: FilterSidebarProps) {
  return (
    <div className="bg-muted rounded-lg p-6 space-y-6">
      <div>
        <h3 className="font-bold text-foreground mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`block w-full text-left px-3 py-2 rounded transition ${
                selectedCategory === cat.id ? "bg-primary text-white" : "text-foreground hover:bg-background"
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
