import React, { useState } from 'react';
import { Container, Typography, Box, Tabs, Tab } from '@mui/material';
import CreatePDServiceTab from './components/CreatePDServiceTab';
import ViewScheduleTab from './components/ViewScheduleTab';

function App() {
  const [tabIndex, setTabIndex] = useState(3);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        bgcolor: '#1a237e', // Deep blue background
        py: 3, // Reduced padding
        px: 4,
        borderRadius: '0 0 16px 16px',
        boxShadow: 3,
        mb: 3,
        background: 'linear-gradient(to right, #1a237e, #283593)', // Subtle gradient
      }}>
        <Typography 
          variant="h4"  // Reduced from h3 to h4
          component="h1" 
          gutterBottom 
          align="left"
          sx={{ 
            color: 'white',
            fontWeight: 500, // Reduced font weight
            fontFamily: '"Poppins", sans-serif', // More modern font
            letterSpacing: '0.5px',
            mb: 1
          }}
        >
          Yasashvi Car Pickup Service
        </Typography>
        <Typography 
          variant="subtitle1" // Changed from h5
          component="h2" 
          align="left"
          sx={{ 
            color: '#e3f2fd',
            fontWeight: 300,
            fontFamily: '"Poppins", sans-serif',
            letterSpacing: '0.5px',
            opacity: 0.9
          }}
        >
          Schedule your car pickup with ease
        </Typography>
      </Box>

      <Box sx={{ 
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: 3,
        bgcolor: 'white',
        mb: 4
      }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange} 
          centered 
          sx={{ 
            bgcolor: '#f5f5f5',
            '& .MuiTab-root': {
              fontSize: '1rem',
              fontWeight: 500,
              py: 2,
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: 'rgba(26, 35, 126, 0.08)'
              }
            },
            '& .Mui-selected': {
              color: '#1a237e !important'
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#1a237e'
            }
          }}
        >
          <Tab label="About Us" />
          <Tab label="Driver Details" />
          <Tab label="Guidelines" />
          <Tab label="Create Pickup" />
          <Tab label="View Pickups" />
        </Tabs>
      </Box>

      <Box sx={{ 
        bgcolor: 'white',
        borderRadius: '16px',
        boxShadow: 3,
        p: 4,
        minHeight: '60vh'
      }}>
        {tabIndex === 0 && (
          <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#1a237e', fontWeight: 600, mb: 4 }}>
              About Yasashvi Car Pickup Service
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
              Yasashvi Car Pickup Service is a premier automotive service provider specializing in Skoda vehicles. 
              Established with a commitment to excellence, we offer convenient pickup and delivery services for 
              your vehicle maintenance needs.
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
              Our team of experienced professionals ensures that your vehicle receives the highest quality care 
              and attention. We pride ourselves on our reliability, punctuality, and customer-focused approach.
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
              With years of experience in the automotive industry, we understand the importance of trust and 
              transparency in our services. That's why we maintain clear communication throughout the entire 
              process, from pickup scheduling to service completion.
            </Typography>
          </Box>
        )}
        {tabIndex === 1 && (
          <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#1a237e', fontWeight: 600, mb: 4 }}>
              Our Professional Drivers
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', mb: 3 }}>
              All our drivers are:
            </Typography>
            <Box sx={{ 
              bgcolor: '#f5f5f5',
              p: 3,
              borderRadius: '8px',
              mb: 4
            }}>
              <Typography variant="body1" component="ul" sx={{ fontSize: '1.1rem', lineHeight: 2 }}>
                <li>Professionally licensed with minimum 5 years of experience</li>
                <li>Background verified and certified</li>
                <li>Trained in customer service excellence</li>
                <li>Knowledgeable about various Skoda models</li>
                <li>Available 24/7 for pickup services</li>
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600, mb: 2 }}>
              Safety Measures
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
              We maintain strict safety protocols including regular vehicle sanitization, 
              GPS tracking, and real-time service updates for your peace of mind.
            </Typography>
          </Box>
        )}
        {tabIndex === 2 && (
          <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#1a237e', fontWeight: 600, mb: 4 }}>
              Guidelines for Creating a Pickup
            </Typography>
            <Box sx={{ 
              bgcolor: '#f5f5f5',
              p: 4,
              borderRadius: '8px'
            }}>
              {[
                "Enter the customer's full name, phone number, and email address.",
                'Provide the vehicle number, model, and brand. Note that the brand is set to "Skoda" by default and cannot be changed.',
                'Specify the pickup location and ensure it is accurate.',
                'Choose a pickup time that is later than the current time.',
                'Click "Create Pickup" to submit the form.'
              ].map((step, index) => (
                <Box key={index} sx={{ display: 'flex', mb: 2, alignItems: 'flex-start' }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#1a237e',
                      mr: 2,
                      minWidth: '30px'
                    }}
                  >
                    {index + 1}.
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                    {step}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
        {tabIndex === 3 && <CreatePDServiceTab />}
        {tabIndex === 4 && <ViewScheduleTab />}
      </Box>
    </Container>
  );
}

export default App;
