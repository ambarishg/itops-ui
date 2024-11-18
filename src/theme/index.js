// src/theme.js

import { extendTheme } from '@chakra-ui/react';
import { selectAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(selectAnatomy.keys);

// Define base styles for the Select component
const baseStyle = definePartsStyle({
  field: {
    backgroundColor: 'white', // Default background color
    color: 'black', // Default text color
    '&:focus': {
      backgroundColor: 'white', // Background on focus
      color: 'black', // Text color on focus
      boxShadow: 'none', // Optional: Remove focus outline
    },
    '& option': {
      color: 'black', // Text color for options
    },
    '&[aria-selected]': {
      backgroundColor: 'white', // Background when selected
      color: 'black', // Text color when selected
    },
  },
});

// Create a multi-style config for the Select component
const selectTheme = defineMultiStyleConfig({ baseStyle });

const theme = extendTheme({
    config: {
        initialColorMode: 'dark',
        useSystemColorMode: false,
    },
    styles: {
        global: {
            body: {
                bg: 'black',
                color: 'white',
                fontFamily: 'Arial, sans-serif', // Custom font family
                lineHeight: '1.6', // Improved line height for readability
            },
        },
    },
    colors: {
        primary: {
            100: '#E6FFFA', // Light teal
            500: '#38B2AC', // Teal
            900: '#2C7A7F', // Dark teal
        },
        secondary: {
            100: '#F7FAFC', // Light gray
            500: '#A0AEC0', // Gray
            900: '#4A5568', // Dark gray
        },
    },
    fonts: {
        heading: 'Poppins, sans-serif', // Custom font for headings
        body: 'Arial, sans-serif', // Custom font for body text
    },
    components: {
        Select: selectTheme,
        Button: {
            baseStyle: {
                borderRadius: 'md', // Rounded corners
                fontWeight: 'bold', // Bold text
            },
            variants: {
                solid: {
                    bg: 'primary.500',
                    color: 'white',
                    _hover: {
                        bg: 'primary.600', // Darker shade on hover
                    },
                },
                outline: {
                    borderColor: 'primary.500',
                    color: 'primary.500',
                    _hover: {
                        bg: 'primary.100',
                    },
                },
            },
        },
    },
});


export default theme;