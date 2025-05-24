interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-primary">AI Headhunter</h1>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex items-center space-x-6">
                <a 
                  href="/resume-builder" 
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Resume Builder
                </a>
                <a 
                  href="/templates" 
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Templates
                </a>
                <a 
                  href="/profile" 
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Profile
                </a>
              </nav>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 AI Headhunter. Built with Next.js and Supabase.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}; 