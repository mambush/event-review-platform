const { pool } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const eventModel = {
  // Create new event
  create: async (eventData) => {
    const eventId = uuidv4();
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Insert into events table
      const query = `
        INSERT INTO events (
          id, title, description, event_image, venue_id, 
          start_datetime, end_datetime, is_recurring, 
          recurrence_pattern, status, created_by
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      await connection.execute(query, [
        eventId,
        eventData.title,
        eventData.description || null,
        eventData.eventImage || null,
        eventData.venueId || null,
        eventData.startDatetime,
        eventData.endDatetime,
        eventData.isRecurring || false,
        eventData.recurrencePattern || null,
        eventData.status || 'draft',
        eventData.createdBy
      ]);
      
      // Insert categories if provided
      if (eventData.categories && eventData.categories.length > 0) {
        const categoryValues = eventData.categories.map(categoryId => [eventId, categoryId]);
        await connection.query(
          'INSERT INTO event_category_mapping (event_id, category_id) VALUES ?',
          [categoryValues]
        );
      }
      
      await connection.commit();
      return eventId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
  
  // Get event by id with related data
  findById: async (id) => {
    const connection = await pool.getConnection();
    
    try {
      // Get event data
      const [eventRows] = await connection.execute(
        `SELECT e.*, v.name as venue_name, v.address as venue_address, v.city as venue_city,
                v.country as venue_country
         FROM events e
         LEFT JOIN venues v ON e.venue_id = v.id
         WHERE e.id = ?`,
        [id]
      );
      
      if (eventRows.length === 0) return null;
      
      const event = eventRows[0];
      
      // Get categories
      const [categoryRows] = await connection.execute(
        `SELECT c.id, c.name, c.description 
         FROM event_categories c
         JOIN event_category_mapping ecm ON c.id = ecm.category_id
         WHERE ecm.event_id = ?`,
        [id]
      );
      
      // Get creator info
      const [creatorRows] = await connection.execute(
        `SELECT id, username, first_name, last_name, profile_image
         FROM users
         WHERE id = ?`,
        [event.created_by]
      );
      
      // Calculate average ratings
      const [ratingRows] = await connection.execute(
        `SELECT 
          AVG(overall_rating) as avg_overall_rating,
          AVG(organization_rating) as avg_organization_rating,
          AVG(content_rating) as avg_content_rating,
          AVG(value_rating) as avg_value_rating,
          COUNT(*) as review_count
         FROM reviews
         WHERE event_id = ?`,
        [id]
      );
      
      return {
        ...event,
        categories: categoryRows,
        creator: creatorRows[0] || null,
        ratings: ratingRows[0]
      };
    } finally {
      connection.release();
    }
  },
  
  // Update event
  update: async (id, eventData, userId) => {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Check if user is creator or admin
      const [userCheck] = await connection.execute(
        `SELECT created_by FROM events WHERE id = ?`,
        [id]
      );
      
      if (userCheck.length === 0) return { success: false, message: 'Event not found' };
      
      const isCreator = userCheck[0].created_by === userId;
      
      // Get user admin status
      const [adminCheck] = await connection.execute(
        `SELECT is_admin FROM users WHERE id = ?`,
        [userId]
      );
      
      const isAdmin = adminCheck.length > 0 && adminCheck[0].is_admin;
      
      if (!isCreator && !isAdmin) {
        return { success: false, message: 'Not authorized to update this event' };
      }
      
      // Build update query for events table
      const fields = [];
      const values = [];
      
      for (const [key, value] of Object.entries(eventData)) {
        // Skip categories as they are handled separately
        if (key === 'categories') continue;
        
        // Convert camelCase to snake_case for database fields
        const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        fields.push(`${dbField} = ?`);
        values.push(value);
      }
      
      if (fields.length > 0) {
        values.push(id);
        const query = `UPDATE events SET ${fields.join(', ')} WHERE id = ?`;
        await connection.execute(query, values);
      }
      
      // Update categories if provided
      if (eventData.categories && Array.isArray(eventData.categories)) {
        // Remove existing category mappings
        await connection.execute(
          'DELETE FROM event_category_mapping WHERE event_id = ?',
          [id]
        );
        
        // Add new category mappings
        if (eventData.categories.length > 0) {
          const categoryValues = eventData.categories.map(categoryId => [id, categoryId]);
          await connection.query(
            'INSERT INTO event_category_mapping (event_id, category_id) VALUES ?',
            [categoryValues]
          );
        }
      }
      
      await connection.commit();
      return { success: true, message: 'Event updated successfully' };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
  
  // Delete event
  delete: async (id, userId) => {
    const connection = await pool.getConnection();
    
    try {
      // Check if user is creator or admin
      const [userCheck] = await connection.execute(
        `SELECT created_by FROM events WHERE id = ?`,
        [id]
      );
      
      if (userCheck.length === 0) return { success: false, message: 'Event not found' };
      
      const isCreator = userCheck[0].created_by === userId;
      
      // Get user admin status
      const [adminCheck] = await connection.execute(
        `SELECT is_admin FROM users WHERE id = ?`,
        [userId]
      );
      
      const isAdmin = adminCheck.length > 0 && adminCheck[0].is_admin;
      
      if (!isCreator && !isAdmin) {
        return { success: false, message: 'Not authorized to delete this event' };
      }
      
      await connection.execute('DELETE FROM events WHERE id = ?', [id]);
      return { success: true, message: 'Event deleted successfully' };
    } finally {
      connection.release();
    }
  },
  
  // Search events with filters and pagination
  search: async (filters = {}, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT 
        e.id, e.title, e.description, e.event_image, e.start_datetime, 
        e.end_datetime, e.status, v.name as venue_name, v.city as venue_city,
        v.country as venue_country, 
        AVG(r.overall_rating) as avg_rating,
        COUNT(DISTINCT r.id) as review_count
      FROM events e
      LEFT JOIN venues v ON e.venue_id = v.id
      LEFT JOIN reviews r ON e.id = r.event_id
    `;
    
    const queryParams = [];
    const whereConditions = [];
    
    // Add filters
    if (filters.title) {
      whereConditions.push('e.title LIKE ?');
      queryParams.push(`%${filters.title}%`);
    }
    
    if (filters.status) {
      whereConditions.push('e.status = ?');
      queryParams.push(filters.status);
    }
    
    if (filters.cityId) {
      whereConditions.push('v.city = ?');
      queryParams.push(filters.cityId);
    }
    
    if (filters.categoryId) {
      query += ` JOIN event_category_mapping ecm ON e.id = ecm.event_id `;
      whereConditions.push('ecm.category_id = ?');
      queryParams.push(filters.categoryId);
    }
    
    if (filters.startDate) {
      whereConditions.push('DATE(e.start_datetime) >= ?');
      queryParams.push(filters.startDate);
    }
    
    if (filters.endDate) {
      whereConditions.push('DATE(e.end_datetime) <= ?');
      queryParams.push(filters.endDate);
    }
    
    if (filters.minRating) {
      whereConditions.push('r.overall_rating >= ?');
      queryParams.push(filters.minRating);
    }
    
    // Add WHERE clause if filters exist
    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(' AND ')}`;
    }
    
    // Group by event ID for aggregate functions
    query += ` GROUP BY e.id `;
    
    // Add sorting
    const sortField = filters.sortBy || 'start_datetime';
    const sortDirection = filters.sortDirection || 'ASC';
    query += ` ORDER BY ${sortField} ${sortDirection} `;
    
    // Add pagination
    query += ' LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);
    
    // Execute query
    const [rows] = await pool.execute(query, queryParams);
    
    // Count total matching events for pagination
    let countQuery = `
      SELECT COUNT(DISTINCT e.id) as total
      FROM events e
      LEFT JOIN venues v ON e.venue_id = v.id
      LEFT JOIN reviews r ON e.id = r.event_id
    `;
    
    if (filters.categoryId) {
      countQuery += ` JOIN event_category_mapping ecm ON e.id = ecm.event_id `;
    }
    
    if (whereConditions.length > 0) {
      countQuery += ` WHERE ${whereConditions.join(' AND ')}`;
    }
    
    const [countResult] = await pool.execute(countQuery, queryParams.slice(0, -2));
    const total = countResult[0].total;
    
    return {
      events: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  },
  
  // Get upcoming events
  getUpcoming: async (limit = 5) => {
    const query = `
      SELECT 
        e.id, e.title, e.description, e.event_image, e.start_datetime, 
        e.end_datetime, v.name as venue_name, v.city as venue_city,
        AVG(r.overall_rating) as avg_rating
      FROM events e
      LEFT JOIN venues v ON e.venue_id = v.id
      LEFT JOIN reviews r ON e.id = r.event_id
      WHERE e.start_datetime > NOW() AND e.status = 'published'
      GROUP BY e.id
      ORDER BY e.start_datetime ASC
      LIMIT ?
    `;
    
    const [rows] = await pool.execute(query, [limit]);
    return rows;
  }
};

module.exports = eventModel;