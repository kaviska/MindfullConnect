export interface PrimeButtonProps {
    className?: string; // Renamed from `style` for clarity
    text: {
        text: string;
        className?: string;
    };
    image?: { 
        src: string;
        width?: number;
        height?: number;
        alt?: string;
        className?: string;
    }; // Image is optional
    onClick?: () => void;
}
