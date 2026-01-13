import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="pt-24 md:pt-32 min-h-screen flex items-center justify-center">
      <div className="container-custom text-center">
        <h1 className="mb-4">404</h1>
        <p className="text-lg text-black/70 mb-8">Page not found</p>
        <Link href="/" className="btn btn-primary">
          Return Home
        </Link>
      </div>
    </div>
  )
}
