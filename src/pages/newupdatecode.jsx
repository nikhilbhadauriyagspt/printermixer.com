{
    category === 'all-in-one-printers' && (

        <div>
            <div >
                <img src="/banner/shopbannertop.png" alt="Shop Banner"
                    className="w-full h-auto  object-cover block" />
            </div>
            <div className="relative w-full overflow-hidden bg-[#fef9c3]">

                {/* Background Image */}
                <img
                    src="/banner/shopbaner.jpg"
                    alt="Shop Banner"
                    className="w-full h-auto min-h-[400px] md:min-h-[500px] lg:h-[900px] object-cover block"
                />

                {/* Text Overlay with Slider */}
                <div className="absolute inset-0 flex items-center justify-end px-6 md:pr-32 lg:pr-64">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="max-w-xl text-left space-y-6 md:space-y-8"
                        >

                            <div className="space-y-2">
                                <span className="inline-block px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-4">
                                    Expert Guide
                                </span>
                                <h2 className="text-xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.1]">
                                    {slides[currentSlide].title}
                                </h2>
                            </div>

                            <ul className="space-y-4 md:space-y-5">
                                {slides[currentSlide].points.map((text, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + (i * 0.1) }}
                                        className="flex items-center justify-start gap-4 text-slate-700 font-bold text-sm md:text-base lg:text-lg"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                                        <span>{text}</span>
                                    </motion.li>
                                ))}
                            </ul>

                            {/* Slide Indicators */}
                            <div className="flex justify-start gap-2 pt-6">
                                {slides.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-300'}`}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}



const slides = [
    {
        title: "How to Setup a Printer",
        points: [
            "Unbox the printer and remove all packaging materials.",
            "Connect the power cable and turn on the printer.",
            "Install the ink or toner cartridges correctly.",
            "Load paper into the paper tray.",
            "Print a test page to check the setup."
        ]
    },
    {
        title: "How to Connect a Printer to Wi-Fi",
        points: [
            "Turn on the printer and open wireless settings.",
            "Select the Wi-Fi or wireless setup option.",
            "Choose your Wi-Fi network from the list.",
            "Enter the Wi-Fi password.",
            "Confirm the connection on the printer display."
        ]
    },
    {
        title: "How to Install Printer Driver",
        points: [
            "Visit the official website of the printer brand.",
            "Search for your printer model.",
            "Download the correct printer driver.",
            "Run the setup file to start installation.",
            "Follow the on-screen instructions to complete it."
        ]
    },
    {
        title: "How to Fix Printer Offline Issue",
        points: [
            "Check that the printer is turned on.",
            "Ensure the printer is connected to Wi-Fi or USB.",
            "Restart the printer and computer.",
            "Disable the “Use Printer Offline” option.",
            "Try printing a test page."
        ]
    }
];

useEffect(() => {
    if (category === 'all-in-one-printers') {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }
}, [category, slides.length]);