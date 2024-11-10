
export default function NavBar() {
    return (
        <nav className="flex items-center justify-center bg-white shadow-md h-20 mb-4">
            {/* Logo */}
            <a href="/" className="flex text-xl font-semibold gap-2">
                <img src="logo192.png" alt="logo" className="h-8" />
                <p>Book Inventory Management</p>
            </a>
        </nav>
    )
}