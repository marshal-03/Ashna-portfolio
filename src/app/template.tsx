// Remounts on every navigation, so each page fades up into place (see .page-enter in globals.css).
export default function Template({ children }: LayoutProps<'/'>) {
  return <div className="page-enter">{children}</div>
}
