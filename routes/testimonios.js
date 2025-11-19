const express = require('express');
const router = express.Router();
const dbConfig = require('../db_config');

router.get('/testimonios', async (req, res) => {
    try {
        const connection = await dbConfig.getConnection();
        const [rows] = await connection.execute('SELECT nombre, puesto, opinion, imagen FROM testimonios');
        
        res.json(rows); 
        
        connection.release();
    } catch (error) {
        console.error('Error al obtener testimonios de la BD:', error);
        
        // Manejo de error mejorado para el cliente
        res.status(500).json({ error: 'Error interno del servidor al obtener testimonios.' });
    }
});
router.post('/testimonios', async (req, res) => {
  try {
    const { nombre, puesto, opinion, imagen } = req.body;

    const connection = await dbConfig.getConnection();
    await connection.execute(
      'INSERT INTO testimonios (nombre, puesto, opinion, imagen) VALUES (?, ?, ?, ?)',
      [nombre, puesto, opinion, imagen]
    );
    connection.release();

    res.status(201).json({ mensaje: 'Testimonio agregado con éxito' });
  } catch (error) {
    console.error('Error al guardar testimonio:', error);
    res.status(500).json({ error: 'Error interno del servidor al guardar testimonio.' });
  }
});


module.exports = router;
