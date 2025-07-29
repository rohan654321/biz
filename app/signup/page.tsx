import Image from "next/image"

export default function signup () {
    return (
        <div>
            <div className="flex justify-center border-1 border-black m-40 p-10">
                <div className="flex grid-cols-2 gap-x-80">
                   <div className="">
                    <Image src={"/logo/logo.png"} alt="logo" height={200} width={200} />
                    </div>
                   <div className="border-1 border-black p-10">
                      welcome
                   </div>
                </div>
            </div>
        </div>
    )
}