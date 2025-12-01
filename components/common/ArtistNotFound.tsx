export function ArtistNotFound({ error }: { error: string | null }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-medium text-foreground">
          Artist Not Found
        </h1>
        <p className="text-muted-foreground">
          {error ?? "The artist you're looking for doesn't exist."}
        </p>
      </div>
    </div>
  );
}
