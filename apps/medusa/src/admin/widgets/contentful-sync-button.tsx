/**
 * Contentful Sync Button Widget
 *
 * Add this component to product detail pages to sync products to Contentful
 * Usage:
 *
 *   <ContentfulSyncButton productId={product.id} productTitle={product.title} />
 */

import { useState } from 'react'
import { Button, Badge } from '@medusajs/ui'

interface ContentfulSyncButtonProps {
  productId: string
  productTitle?: string
  locales?: {
    [key: string]: {
      title?: string
      description?: string
      seoTitle?: string
      seoDescription?: string
    }
  }
  onSyncComplete?: (result: any) => void
}

interface SyncResult {
  success: boolean
  data?: any
  error?: string
  message?: string
}

export const ContentfulSyncButton = ({
  productId,
  productTitle = 'Product',
  locales,
  onSyncComplete,
}: ContentfulSyncButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle')

  const handleSync = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    setSyncStatus('syncing')

    try {
      // Get admin token from localStorage or cookie
      const token = localStorage.getItem('admin_token') || ''

      const response = await fetch('/admin/contentful/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
          locales: locales || {
            'en-US': {
              title: productTitle,
            },
          },
        }),
      })

      const result: SyncResult = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to sync product to Contentful')
      }

      setSuccess(true)
      setSyncStatus('success')
      onSyncComplete?.(result.data)

      // Reset success message after 5 seconds
      const timer = setTimeout(() => {
        setSuccess(false)
        setSyncStatus('idle')
      }, 5000)

      return () => clearTimeout(timer)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      setSyncStatus('error')
      console.error('Contentful sync error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckStatus = async () => {
    try {
      const token = localStorage.getItem('admin_token') || ''

      const response = await fetch(`/admin/contentful/sync/status/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (data.synced) {
        setSuccess(true)
        setSyncStatus('success')
        setTimeout(() => {
          setSuccess(false)
          setSyncStatus('idle')
        }, 3000)
      }
    } catch (err) {
      console.error('Failed to check status:', err)
    }
  }

  const handleRemove = async () => {
    if (!window.confirm('Are you sure you want to remove this product from Contentful?')) {
      return
    }

    try {
      const token = localStorage.getItem('admin_token') || ''

      const response = await fetch(`/admin/contentful/sync/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const result: SyncResult = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to remove product')
      }

      setSuccess(true)
      setSyncStatus('success')
      setTimeout(() => {
        setSuccess(false)
        setSyncStatus('idle')
      }, 3000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      setSyncStatus('error')
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '16px',
        borderRadius: '8px',
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>
          Contentful Sync
        </h3>
        {syncStatus === 'success' && (
          <Badge color="green" size="small">
            Synced
          </Badge>
        )}
        {syncStatus === 'error' && (
          <Badge color="red" size="small">
            Error
          </Badge>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Button
          onClick={handleSync}
          disabled={isLoading || syncStatus === 'syncing'}
          variant="secondary"
          size="small"
        >
          {isLoading || syncStatus === 'syncing' ? 'Syncing...' : 'Sync to Contentful'}
        </Button>

        <Button
          onClick={handleCheckStatus}
          disabled={isLoading}
          variant="secondary"
          size="small"
        >
          Check Status
        </Button>

        <Button
          onClick={handleRemove}
          disabled={isLoading}
          variant="danger"
          size="small"
        >
          Remove from Contentful
        </Button>
      </div>

      {error && (
        <div
          style={{
            padding: '8px 12px',
            backgroundColor: '#fee',
            borderRadius: '4px',
            color: '#c33',
            fontSize: '13px',
            border: '1px solid #fcc',
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {success && (
        <div
          style={{
            padding: '8px 12px',
            backgroundColor: '#efe',
            borderRadius: '4px',
            color: '#3a3',
            fontSize: '13px',
            border: '1px solid #cfc',
          }}
        >
          ✓ Product synced to Contentful successfully!
        </div>
      )}

      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
        <p style={{ margin: '4px 0' }}>
          Syncs product data to Contentful CMS with multi-language support
        </p>
        <p style={{ margin: '4px 0' }}>
          <strong>Supported locales:</strong> en-US, vi
        </p>
      </div>
    </div>
  )
}

export default ContentfulSyncButton
