import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import EventCard from '../components/common/EventCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import RecommendedEvents from '../components/recommendations/RecommendedEvents';
import { useAuth } from '../hooks/useAuth';
import { getTrendingEvents } from '/src/services/eventService.js';

const heroImage = "https://placehold.co/1200x400?text=Event+Review+Platform";

const HomePage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const upcomingData = await getUpcomingEvents();
        const trendingData = await getTrendingEvents();
        
        setUpcomingEvents(upcomingData);
        setTrendingEvents(trendingData);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div 
        className="hero-section py-5 mb-4" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          padding: '80px 0'
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col md={7}>
              <h1 className="display-4 fw-bold mb-4">Discover & Review Amazing Events</h1>
              <p className="lead mb-4">
                Find the best events in your area, read genuine reviews, and share your experiences with others. 
                Our AI-powered platform helps you make informed decisions about the events you attend.
              </p>
              <div className="d-flex gap-3">
                <Link to="/events">
                  <Button variant="primary" size="lg">Explore Events</Button>
                </Link>
                {!user && (
                  <Link to="/register">
                    <Button variant="outline-light" size="lg">Sign Up Now</Button>
                  </Link>
                )}
              </div>
            </Col>
            <Col md={5} className="d-none d-md-block">
              <Card className="shadow-lg bg-dark text-white p-4 rounded-lg">
                <h3 className="mb-3">AI-Powered Event Discovery</h3>
                <ul className="list-unstyled">
                  <li className="mb-2">✓ Personalized recommendations</li>
                  <li className="mb-2">✓ Sentiment analysis of reviews</li>
                  <li className="mb-2">✓ Smart event categorization</li>
                  <li className="mb-2">✓ Trend insights and predictions</li>
                </ul>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Personalized Recommendations */}
      {user && (
        <section className="py-4">
          <Container>
            <h2 className="mb-4">Recommended For You</h2>
            <RecommendedEvents />
          </Container>
        </section>
      )}

      {/* Upcoming Events */}
      <section className="py-4 bg-light">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Upcoming Events</h2>
            <Link to="/events">
              <Button variant="outline-primary">View All</Button>
            </Link>
          </div>
          <Row>
            {upcomingEvents.map(event => (
              <Col key={event.id} lg={4} md={6} className="mb-4">
                <EventCard event={event} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Trending Events */}
      <section className="py-4">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Trending Now</h2>
            <Link to="/events?sort=trending">
              <Button variant="outline-primary">View All</Button>
            </Link>
          </div>
          <Row>
            {trendingEvents.map(event => (
              <Col key={event.id} lg={4} md={6} className="mb-4">
                <EventCard event={event} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">How It Works</h2>
          <Row>
            <Col md={3} className="text-center mb-4">
              <div className="bg-primary text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{ width: '80px', height: '80px' }}>
                <h3>1</h3>
              </div>
              <h4>Discover Events</h4>
              <p>Find events that match your interests through our AI-powered recommendations.</p>
            </Col>
            <Col md={3} className="text-center mb-4">
              <div className="bg-primary text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{ width: '80px', height: '80px' }}>
                <h3>2</h3>
              </div>
              <h4>Save to Calendar</h4>
              <p>Add events to your personal calendar and get reminders before they start.</p>
            </Col>
            <Col md={3} className="text-center mb-4">
              <div className="bg-primary text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{ width: '80px', height: '80px' }}>
                <h3>3</h3>
              </div>
              <h4>Attend Events</h4>
              <p>Experience the events you've chosen and form your own opinions.</p>
            </Col>
            <Col md={3} className="text-center mb-4">
              <div className="bg-primary text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{ width: '80px', height: '80px' }}>
                <h3>4</h3>
              </div>
              <h4>Share Reviews</h4>
              <p>Post your honest reviews to help others make better decisions.</p>
            </Col>
          </Row>
          <div className="text-center mt-4">
            <Link to="/about">
              <Button variant="outline-primary" size="lg">Learn More</Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;