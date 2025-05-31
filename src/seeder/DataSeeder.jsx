import React, { useState } from 'react'
import { collection, doc, writeBatch } from 'firebase/firestore'
import { db } from '../firebase-config'
import { propertyData } from './propertyData'

const DataSeeder = () => {
  const [isSeeding, setIsSeeding] = useState(false)
  const [isDeseeding, setIsDeseeding] = useState(false)
  const [message, setMessage] = useState('')

  const seedProperties = async () => {
    console.log('Starting seed process...')
    setIsSeeding(true)
    setMessage('Seeding properties...')

    try {
      console.log('Creating batch with', propertyData.length, 'properties')
      const batch = writeBatch(db)

      propertyData.forEach((property, index) => {
        console.log(`Adding property ${index + 1}:`, property.propName)
        const docRef = doc(collection(db, 'listings'), property.propertyID)
        batch.set(docRef, property)
      })

      console.log('Committing batch to Firestore...')
      await batch.commit()
      console.log('Batch committed successfully!')
      setMessage(`✅ Successfully seeded ${propertyData.length} properties!`)
    } catch (error) {
      console.error('Error seeding properties:', error)
      setMessage(`❌ Error seeding properties: ${error.message}`)
    } finally {
      setIsSeeding(false)
    }
  }

  const deseedProperties = async () => {
    console.log('Starting de-seed process...')
    setIsDeseeding(true)
    setMessage('Removing seeded properties...')

    try {
      console.log(
        'Creating delete batch for',
        propertyData.length,
        'properties'
      )
      const batch = writeBatch(db)

      // Get all the property IDs we want to delete
      const propertyIDs = propertyData.map((property) => property.propertyID)

      propertyIDs.forEach((propertyID, index) => {
        console.log(`Marking for deletion ${index + 1}:`, propertyID)
        const docRef = doc(collection(db, 'listings'), propertyID)
        batch.delete(docRef)
      })

      console.log('Committing delete batch to Firestore...')
      await batch.commit()
      console.log('Delete batch committed successfully!')
      setMessage(
        `✅ Successfully removed ${propertyIDs.length} seeded properties!`
      )
    } catch (error) {
      console.error('Error removing properties:', error)
      setMessage(`❌ Error removing properties: ${error.message}`)
    } finally {
      setIsDeseeding(false)
    }
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Database Seeder</h3>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button
          onClick={seedProperties}
          disabled={isSeeding || isDeseeding}
          style={{
            padding: '10px 20px',
            backgroundColor: isSeeding || isDeseeding ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isSeeding || isDeseeding ? 'not-allowed' : 'pointer',
          }}
        >
          {isSeeding ? 'Seeding...' : 'Seed Database'}
        </button>

        <button
          onClick={deseedProperties}
          disabled={isSeeding || isDeseeding}
          style={{
            padding: '10px 20px',
            backgroundColor: isSeeding || isDeseeding ? '#ccc' : '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isSeeding || isDeseeding ? 'not-allowed' : 'pointer',
          }}
        >
          {isDeseeding ? 'Removing...' : 'Remove Seeded Data'}
        </button>
      </div>

      {message && (
        <p
          style={{
            marginTop: '10px',
            color: message.includes('✅')
              ? 'green'
              : message.includes('❌')
              ? 'red'
              : 'black',
          }}
        >
          {message}
        </p>
      )}

      <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
        <p>
          <strong>Properties to be seeded/removed:</strong>
        </p>
        <ul style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {propertyData.map((property, index) => (
            <li key={property.propertyID}>
              {index + 1}. {property.propName} ({property.propertyID})
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default DataSeeder
