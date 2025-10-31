import type { Section, Theme } from '@/types/wireframe'

interface FormRendererProps {
  section: Section
  theme: Theme
}

/**
 * FormRenderer: Form with fields from section.fields[]
 * Renders labels, inputs, helper text, and submit button
 * Uses ONLY Tailwind (no shadcn Input component)
 */
export function FormRenderer({ section, theme }: FormRendererProps) {
  const fields = section.fields || []
  const content = section.content || {}
  const submitLabel = content.submit_label || 'Submit'

  return (
    <section className="px-6 py-8">
      <div className="mx-auto max-w-md">
        {section.title && (
          <h2
            className="mb-6 font-bold"
            style={{
              fontSize: `${theme.typography.h2}px`,
              color: theme.colors.foreground,
            }}
          >
            {section.title}
          </h2>
        )}

        {section.description && (
          <p
            className="mb-8"
            style={{
              fontSize: `${theme.typography.body}px`,
              color: theme.colors.muted,
            }}
          >
            {section.description}
          </p>
        )}

        <form className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="mb-1 block text-sm font-medium"
                style={{ color: theme.colors.foreground }}
              >
                {field.label}
                {field.required && <span className="ml-1 text-red-500">*</span>}
              </label>

              {field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  required={field.required}
                  rows={4}
                  className="w-full border px-3 py-2 transition-colors focus:outline-none focus:ring-2"
                  style={{
                    borderColor: theme.colors.border,
                    borderRadius: `${theme.radius}px`,
                    fontSize: `${theme.typography.body}px`,
                  }}
                />
              ) : field.type === 'select' ? (
                <select
                  id={field.name}
                  name={field.name}
                  required={field.required}
                  className="w-full border px-3 py-2 transition-colors focus:outline-none focus:ring-2"
                  style={{
                    borderColor: theme.colors.border,
                    borderRadius: `${theme.radius}px`,
                    fontSize: `${theme.typography.body}px`,
                  }}
                >
                  <option value="">Select...</option>
                </select>
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full border px-3 py-2 transition-colors focus:outline-none focus:ring-2"
                  style={{
                    borderColor: theme.colors.border,
                    borderRadius: `${theme.radius}px`,
                    fontSize: `${theme.typography.body}px`,
                  }}
                />
              )}

              {field.helper_text && (
                <p
                  className="mt-1 text-sm"
                  style={{ color: theme.colors.muted }}
                >
                  {field.helper_text}
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
            style={{
              backgroundColor: theme.colors.primary,
              borderRadius: `${theme.radius}px`,
              fontSize: `${theme.typography.body}px`,
            }}
          >
            {submitLabel}
          </button>
        </form>
      </div>
    </section>
  )
}

