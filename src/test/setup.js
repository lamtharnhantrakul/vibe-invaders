// Mock canvas for testing
global.HTMLCanvasElement.prototype.getContext = () => ({
    fillRect: jest.fn(),
    strokeRect: jest.fn(),
    fillText: jest.fn(),
    strokeText: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    createRadialGradient: jest.fn(() => ({
        addColorStop: jest.fn()
    })),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    font: '',
    textAlign: '',
    shadowColor: '',
    shadowBlur: 0
});

// Mock AudioContext
global.AudioContext = jest.fn().mockImplementation(() => ({
    createBuffer: jest.fn(() => ({
        getChannelData: jest.fn(() => new Float32Array(4410))
    })),
    createBufferSource: jest.fn(() => ({
        buffer: null,
        connect: jest.fn(),
        start: jest.fn()
    })),
    createGain: jest.fn(() => ({
        gain: { value: 0.3 },
        connect: jest.fn()
    })),
    destination: {}
}));

// Mock webkitAudioContext
global.webkitAudioContext = global.AudioContext;

// Mock DOM elements
global.document = {
    getElementById: jest.fn(() => ({
        textContent: '',
        style: { display: '' }
    })),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
};

global.window = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    requestAnimationFrame: jest.fn(cb => setTimeout(cb, 16))
}; 