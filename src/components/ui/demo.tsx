import { Header } from '@/components/ui/header-2';

export default function Demo() {
  return (
    <div className="w-full bg-background text-foreground">
      <Header links={[
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'About', href: '#about' },
      ]} />
      <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-12">
        {['features', 'pricing', 'about'].map(id => (
          <section key={id} id={id} aria-label={id} className="mb-8 space-y-2">
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className="mb-8 space-y-2" aria-hidden="true">
                <div className="h-4 w-full rounded-md border border-solid border-border bg-accent" />
                <div className="h-4 w-full rounded-md border border-solid border-border bg-accent" />
                <div className="h-4 w-1/2 rounded-md border border-solid border-border bg-accent" />
              </div>
            ))}
          </section>
        ))}
      </main>
    </div>
  );
}
