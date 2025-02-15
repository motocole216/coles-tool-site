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

    // Function to update background color based on scroll position
    const updateBackgroundColor = () => {
        const maxScroll = getMaxScroll();
        const currentScroll = window.scrollY;
        const scrollFraction = currentScroll / maxScroll;
        
        // Calculate which color pair to interpolate between
        const numColors = colors.length;
        const interval = 1 / (numColors - 1);
        const colorIndex = Math.min(Math.floor(scrollFraction / interval), numColors - 2);
        const colorFraction = (scrollFraction - colorIndex * interval) / interval;

        // Interpolate between the two colors
        const color = interpolateColor(
            colors[colorIndex],
            colors[colorIndex + 1],
            colorFraction
        );

        // Apply the color with a smooth transition
        document.body.style.backgroundColor = color;
    };

    // Add scroll event listener with throttling
    let ticking = false;
    document.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateBackgroundColor();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial color update
    updateBackgroundColor();
}); 