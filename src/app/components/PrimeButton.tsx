import Image from 'next/image';
import { PrimeButtonProps } from '../../type/type';

export default function PrimeButton({ className, text, image, onClick }: PrimeButtonProps) {
    return (
        <button className={className} onClick={onClick}>
            {image && <Image className={image.className} src={image.src} alt={image.alt || 'button image'} width={image.width || 20} height={image.height || 20} />}
            <span className={text.className}>{text.text}</span>
        </button>
    );
}

