export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-primary">HomeInOne</h1>
          <p className="mt-1 text-sm text-foreground/60">Gestion du quotidien familial</p>
        </div>
        {children}
      </div>
    </div>
  )
}
