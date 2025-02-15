document.addEventListener('DOMContentLoaded', () => {
    // Get the maximum scroll height (total scrollable distance)
    const getMaxScroll = () => {
        return Math.max(
            document.body.scrollHeight - window.innerHeight,
            document.documentElement.scrollHeight - window.innerHeight
        );
    };

    // Get all scroll background colors from CSS variables
    const colors = [
        getComputedStyle(document.documentElement).getPropertyValue('--scroll-color-1').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--scroll-color-2').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--scroll-color-3').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--scroll-color-4').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--scroll-color-5').trim()
    ];

    // Select all elements that should spin
    const spinElements = document.querySelectorAll('.spin-on-scroll');
    
    // Function to interpolate between two colors
    const interpolateColor = (color1, color2, factor) => {
        // Convert hex to RGB
        const hex2rgb = (hex) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return [r, g, b];
        };

        // Convert RGB to hex
        const rgb2hex = (r, g, b) => {
            return '#' + [r, g, b]
                .map(x => Math.round(x))
                .map(x => x.toString(16).padStart(2, '0'))
                .join('');
        };

        const [r1, g1, b1] = hex2rgb(color1);
        const [r2, g2, b2] = hex2rgb(color2);

        const r = r1 + (r2 - r1) * factor;
        const g = g1 + (g2 - g1) * factor;
        const b = b1 + (b2 - b1) * factor;

        return rgb2hex(r, g, b);
    };

    // Function to check if element is in viewport
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    };

    // Function to calculate rotation based on element position
    const calculateRotation = (element) => {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const scrollProgress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
        return Math.min(Math.max(scrollProgress * 360, 0), 360); // Full 360-degree rotation
    };

    // Function to update background color and text rotation based on scroll position
    const updateEffects = () => {
        const maxScroll = getMaxScroll();
        const currentScroll = window.scrollY;
        const scrollFraction = currentScroll / maxScroll;
        
        // Update background color
        const numColors = colors.length;
        const interval = 1 / (numColors - 1);
        const colorIndex = Math.min(Math.floor(scrollFraction / interval), numColors - 2);
        const colorFraction = (scrollFraction - colorIndex * interval) / interval;

        const color = interpolateColor(
            colors[colorIndex],
            colors[colorIndex + 1],
            colorFraction
        );

        document.body.style.backgroundColor = color;

        // Update text rotation for visible elements
        spinElements.forEach(element => {
            if (isInViewport(element)) {
                const rotation = calculateRotation(element);
                element.style.transform = `rotate(${rotation}deg)`;
            }
        });
    };

    // Add scroll event listener with throttling
    let ticking = false;
    document.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateEffects();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial update
    updateEffects();
}); 