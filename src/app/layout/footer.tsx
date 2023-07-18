export default function Footer() {
    return <div className={'container mx-auto'}>
        <div className={'p-2 text-center border-t-gray-100 border-t-2'}>
            &copy; Hexagon {new Date().getFullYear()}
        </div>
    </div>
}
