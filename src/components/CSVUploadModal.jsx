import { useState, useRef } from 'react'
import { Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useOrg } from '../context/OrgContextCore'
import './CSVUploadModal.css'

const CSVUploadModal = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewData, setPreviewData] = useState(null)
  const fileInputRef = useRef(null)

  const { user } = useAuth()
  const { currentOrgId } = useOrg()

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setError('Please select a valid CSV file')
        return
      }
      
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size must be less than 10MB')
        return
      }

      setFile(selectedFile)
      setError('')
      previewCSV(selectedFile)
    }
  }

  const previewCSV = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const csv = e.target.result
      const lines = csv.split('\n').slice(0, 5) // Preview first 5 rows
      const rows = lines.map(line => line.split(',').map(cell => cell.trim()))
      setPreviewData(rows)
    }
    reader.readAsText(file)
  }

  const handleUpload = async () => {
    if (!file || !user || !currentOrgId) {
      setError('Missing required information for upload')
      return
    }

    setLoading(true)
    setError('')
    setUploadProgress(0)

    try {
      // Generate unique filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const filename = `${currentOrgId}/${user.id}/${timestamp}_${file.name}`

      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('csv-uploads')
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('csv-uploads')
        .getPublicUrl(filename)

      // Save file record to database
      const { data: dbData, error: dbError } = await supabase
        .from('files_uploaded')
        .insert([
          {
            org_id: currentOrgId,
            user_id: user.id,
            filename: file.name,
            file_path: filename,
            file_size: file.size,
            file_type: 'text/csv',
            storage_url: publicUrl,
            uploaded_at: new Date().toISOString()
          }
        ])
        .select()

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`)
      }

      setUploadProgress(100)
      setSuccess(true)
      
      // Close modal after success
      setTimeout(() => {
        handleClose()
      }, 2000)

    } catch (err) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload file')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    setError('')
    setSuccess(false)
    setUploadProgress(0)
    setPreviewData(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClose()
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      if (droppedFile.type !== 'text/csv' && !droppedFile.name.endsWith('.csv')) {
        setError('Please select a valid CSV file')
        return
      }
      setFile(droppedFile)
      setError('')
      previewCSV(droppedFile)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="csv-modal" onClick={e => e.stopPropagation()}>
        <div className="csv-modal-header">
          <h2>Import CSV File</h2>
          <button className="csv-close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="csv-modal-body">
          {!file && !success && (
            <div 
              className="csv-dropzone"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={48} className="csv-upload-icon" />
              <p className="csv-dropzone-text">
                Drop your CSV file here or <span className="csv-browse">browse</span>
              </p>
              <p className="csv-dropzone-hint">Maximum file size: 10MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>
          )}

          {file && !success && (
            <div className="csv-file-info">
              <div className="csv-file-header">
                <FileText size={20} />
                <div className="csv-file-details">
                  <p className="csv-filename">{file.name}</p>
                  <p className="csv-filesize">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>

              {previewData && (
                <div className="csv-preview">
                  <h4>Preview (first 5 rows):</h4>
                  <div className="csv-table-container">
                    <table className="csv-preview-table">
                      <tbody>
                        {previewData.map((row, index) => (
                          <tr key={index} className={index === 0 ? 'csv-header-row' : ''}>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {success && (
            <div className="csv-success">
              <CheckCircle size={48} className="csv-success-icon" />
              <h3>Upload Successful!</h3>
              <p>Your CSV file has been uploaded and saved to your organization.</p>
            </div>
          )}

          {error && (
            <div className="csv-error">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {loading && (
            <div className="csv-progress">
              <div className="csv-progress-bar">
                <div 
                  className="csv-progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p>Uploading... {uploadProgress}%</p>
            </div>
          )}
        </div>

        <div className="csv-modal-footer">
          <button className="csv-btn csv-btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          {file && !success && (
            <button 
              className="csv-btn csv-btn-primary" 
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload CSV'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CSVUploadModal
