import Bracket from "./Bracket";

const Brackets = () => {
    return (
        <main className="text-white mt-12">
            <div className="max-w-7xl mx-auto border-2 border-white rounded-3xl px-8 pt-4 pb-8 lg:py-20 flex flex-col justify-center">
                <div className="lg:flex lg:items-center lg:justify-center lg:mx-auto">
                    <div className="z-10 mb-6 lg:mb-0 lg:mr-20">
                        <Bracket
                            type="Elite Scout"
                            twitterHandle="@TheCryptoDog"
                            imgSrc="https://via.placeholder.com/50"
                        />
                    </div>
                    <div className="relative flex flex-col items-center justify-between lg:before:absolute lg:before:left-0 lg:before:top-11 lg:before:h-[calc(100%-86px)] lg:before:border-l-4 lg:before:border-white lg:after:absolute lg:after:top-1/2 lg:after:-left-[230px] lg:after:w-[230px] lg:after:border-t-4 lg:after:border-white">
                        <div className="w-full mb-6 lg:flex lg:mb-40">
                            <div className="relative pl-4 sm:pl-8 lg:pl-20 lg:before:absolute lg:before:w-20 lg:before:left-0 lg:before:top-1/2 lg:before:border-t-4 lg:before:border-white">
                                <Bracket type="Senior Scout" />
                            </div>
                            <div className="relative pl-8 sm:pl-16 lg:pl-20 lg:before:absolute lg:before:w-20 lg:before:left-0 lg:before:top-1/2 lg:before:border-t-4 lg:before:border-white">
                                <Bracket type="Member" />
                            </div>
                        </div>
                        <div className="w-full lg:flex">
                            <div className="relative pl-4 sm:pl-8 lg:pl-20 lg:before:absolute lg:before:w-20 lg:before:left-0 lg:before:top-1/2 lg:before:border-t-4 lg:before:border-white">
                                <Bracket type="Senior Scout" />
                            </div>
                            <div className="relative pl-8 sm:pl-16 lg:pl-20 lg:before:absolute lg:before:w-20 lg:before:left-0 lg:before:top-1/2 lg:before:border-t-4 lg:before:border-white">
                                <Bracket type="Member" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Brackets;