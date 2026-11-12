export default function EmptyLayout({ title, children }) {
  return (
    <div className="EmptyLayout">
      <title>{title}</title>

      <div className="bg-background-200 min-h-screen">{children}</div>
    </div>
  );
}
