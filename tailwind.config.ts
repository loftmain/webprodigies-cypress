import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			'washed-Purple/washed-purple-50': '#f8f7ff',
  			'washed-Purple/washed-purple-100': '#e8e7ff',
  			'washed-Purple/washed-purple-200': '#dddcff',
  			'washed-Purple/washed-purple-300': '#cdcbff',
  			'washed-Purple/washed-purple-400': '#c3c1ff',
  			'washed-Purple/washed-purple-500': '#b4b2ff',
  			'washed-Purple/washed-purple-600': '#a4a2e8',
  			'washed-Purple/washed-purple-700': '#807eb5',
  			'washed-Purple/washed-purple-800': '#63628c',
  			'washed-Purple/washed-purple-900': '#4c4b6b',
  			'washed-Blue/washed-blue-50': '#f0f3ff',
  			'washed-Blue/washed-blue-100': '#d0daff',
  			'washed-Blue/washed-blue-200': '#bac9ff',
  			'washed-Blue/washed-blue-300': '#9ab0ff',
  			'washed-Blue/washed-blue-400': '#86a1ff',
  			'washed-Blue/washed-blue-500': '#6889ff',
  			'washed-Blue/washed-blue-600': '#5f7de8',
  			'washed-Blue/washed-blue-700': '#4a61b5',
  			'washed-Blue/washed-blue-800': '#394b8c',
  			'washed-Blue/washed-blue-900': '#2c3a6b',
  			'primary-Blue/primary-blue-50': '#e6f0ff',
  			'primary-Blue/primary-blue-100': '#b1d1ff',
  			'primary-Blue/primary-blue-200': '#8bbaff',
  			'primary-Blue/primary-blue-300': '#569bff',
  			'primary-Blue/primary-blue-400': '#3587ff',
  			'primary-Blue/primary-blue-500': '#0369ff',
  			'primary-Blue/primary-blue-600': '#0360e8',
  			'primary-Blue/primary-blue-700': '#024bb5',
  			'primary-Blue/primary-blue-800': '#023a8c',
  			'primary-Blue/primary-blue-900': '#012c6b',
  			'Primary-Purple/primary-purple-50': '#f1e6ff',
  			'Primary-Purple/primary-purple-100': '#d3b0ff',
  			'Primary-Purple/primary-purple-200': '#bd8aff',
  			'Primary-Purple/primary-purple-300': '#9f55ff',
  			'Primary-Purple/primary-purple-400': '#8d34ff',
  			'Primary-Purple/primary-purple-500': '#7001ff',
  			'Primary-Purple/primary-purple-600': '#6601e8',
  			'Primary-Purple/primary-purple-700': '#5001b5',
  			'Primary-Purple/primary-purple-800': '#3e018c',
  			'Primary-Purple/primary-purple-900': '#2f006b',
  			'Neutrals/neutrals-1': '#ffffff',
  			'Neutrals/neutrals-2': '#fcfcfd',
  			'Neutrals/neutrals-3': '#f5f5f6',
  			'Neutrals/neutrals-4': '#f0f0f1',
  			'Neutrals/neutrals-5': '#d9d9dc',
  			'Neutrals/neutrals-6': '#c0bfc4',
  			'Neutrals/neutrals-7': '#8d8c95',
  			'Neutrals/neutrals-8': '#5b5966',
  			'Neutrals/neutrals-9': '#464553',
  			'Neutrals/neutrals-10': '#282637',
  			'Neutrals/neutrals-11': '#201f30',
  			'Neutrals/neutrals-12': '#161427',
  			'Neutrals/neutrals-13': '#020014',
  			'brand/brand-washedPurple': '#b5b2ff',
  			'brand/brand-washedBlue': '#6889ff',
  			'brand/brand-primaryBlue': '#0469ff',
  			'brand/brand-primaryPurple': '#7000ff',
  			'brand/brand-dark': '#030014'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
