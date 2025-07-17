import { create, all, MathJsStatic } from 'mathjs';

// Create a math.js instance
const math: MathJsStatic = create(all);

// Import custom functions and disable unsafe ones
math.import({
    // Disable potentially unsafe functions
    import: () => { throw new Error('Function import is disabled for security reasons.') },
    createUnit: () => { throw new Error('Function createUnit is disabled for security reasons.') },
}, {
    override: true
});

// Export the single, configured instance for use throughout the app
export { math };