import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    body: 'Arial, sans-serif',
    heading: 'Arial, sans-serif',
  },
  components: {
    Input: {
      baseStyle: {
        borderColor: 'black', // Set default border color to black
        borderWidth: '2px', // Set a thicker border for visibility
        _focus: {
          borderColor: 'black', // Keep focus state consistent
          boxShadow: '0 0 0 1px black', // Optional shadow on focus
        },
      },
    },
    Select: {
      baseStyle: {
        field: {
          borderColor: 'black', // Set default border color to black
          borderWidth: '2px', // Set a thicker border for visibility
          _focus: {
            borderColor: 'black', // Keep focus state consistent
            boxShadow: '0 0 0 1px black', // Optional shadow on focus
          },
        },
      },
    },
    Button: {
      baseStyle: {
        borderColor: 'black', // Default border color
        bgColor: 'white', // Background color
        color: 'black', // Text color
        borderWidth: '2px', // Default border width
        _hover: {
          bgColor: '#f0f0f0', // Light grey on hover
          borderColor: 'black', // Maintain black border on hover
        },
      },
    },
  },
});

export default theme;
