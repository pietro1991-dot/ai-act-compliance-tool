export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-8 text-center text-sm text-muted-foreground md:flex-row md:justify-between">
        <p>&copy; {new Date().getFullYear()} AI Act Compliance Tool</p>
        <p className="max-w-xl text-xs">
          Questo strumento fornisce una valutazione preliminare generata
          automaticamente. Non costituisce consulenza legale. Per la
          documentazione di conformità ufficiale, consulta un professionista
          abilitato.
        </p>
      </div>
    </footer>
  );
}
