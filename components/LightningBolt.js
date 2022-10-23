import Image from "next/image";

const LightningBolt = ({active=false, filled=false}) => {
    return ( 
        <li className={`transition-all max-w-[25px] ${active ? 'scale-125' : ''}`}>
          <Image src={`/assets/images/lightning-${filled ? 'filled' : 'empty'}.webp`} alt="Lightning Bolt Icon" width={34} height={55} />
        </li>
     );
}
 
export default LightningBolt;