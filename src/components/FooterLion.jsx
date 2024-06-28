const FooterLion = () => {
    const getCurrentYear = () => {
        return new Date().getFullYear();
    };

    return (
        <footer className="text-[#FF014C] body-font bg-[#504A7980] mt-5">
            <div className="container mx-auto py-4 px-14 flex flex-wrap flex-col">
                <p className="text-[#FF014C] text-sm text-center">
                    © {getCurrentYear()} Movies App —
                    <a
                        href="mailto:ndabagajeanlionel@gmail.com"
                        className="text-[#F0BE4D] ml-1"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        @lionel
                    </a>
                </p>
            </div>
        </footer>
    )
}

export default FooterLion