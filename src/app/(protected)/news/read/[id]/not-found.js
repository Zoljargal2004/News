export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <span className="text-7xl font-black">404</span>
      <h1 className="text-3xl font-bold">Мэдээ олдсонгүй</h1>
      <p className="max-w-xl text-muted-foreground">
        Таны хайж буй нийтлэл байхгүй эсвэл устгагдсан байж магадгүй.
      </p>
    </div>
  );
}
