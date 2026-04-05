import { useEffect, useRef } from 'react'
import { supabase } from '@/integrations/supabase/client'

/**
 * useRealtimeTable
 * Subscribes to Supabase Realtime for a given table and calls `onRefetch`
 * whenever an INSERT, UPDATE, or DELETE event occurs.
 *
 * Usage:
 *   useRealtimeTable('articles', fetchArticles)
 *   useRealtimeTable('community_posts', fetchPosts)
 */
export function useRealtimeTable(table: string, onRefetch: () => void) {
  const onRefetchRef = useRef(onRefetch)

  // Keep the ref up to date so we don't need to re-subscribe on every render
  useEffect(() => {
    onRefetchRef.current = onRefetch
  })

  useEffect(() => {
    const channel = supabase
      .channel(`realtime:${table}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        () => {
          // Re-fetch whenever anything changes on this table
          onRefetchRef.current()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table])
}
