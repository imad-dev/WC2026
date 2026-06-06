/**
 * Reusable JSON-LD Structured Data component.
 * Renders a <script type="application/ld+json"> tag.
 */
export function StructuredData({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
