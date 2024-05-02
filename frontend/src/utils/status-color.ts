export const statusColorMap = (color: string): string => {
    // Colors returned here and that is combined with prefixes like "text-.." need to be safelisted
    switch(color) {
        case "info":
            return `info`
        case "neutral":
            return `neutral-300`
        case "warning":
            return `warning`
        default:
            return `info`
    }
};

export const statusColorMapOrder = (color: string): number => {
    return ['info', 'neutral', 'warning', ''].indexOf(color)
};
