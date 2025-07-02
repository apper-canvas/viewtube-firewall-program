import { toast } from 'react-toastify'

class PlaylistService {
  constructor() {
    this.tableName = 'playlist'
    this.apperClient = null
    this.initializeClient()
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "video_ids" } },
          { field: { Name: "thumbnail" } },
          { field: { Name: "video_count" } }
        ],
        orderBy: [
          { fieldName: "Name", sorttype: "ASC" }
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching playlists:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return []
    }
  }

  async getById(recordId) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "video_ids" } },
          { field: { Name: "thumbnail" } },
          { field: { Name: "video_count" } }
        ]
      }

      const response = await this.apperClient.getRecordById(this.tableName, recordId, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching playlist with ID ${recordId}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async create(playlistData) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      // Handle video_ids conversion
      let videoIds = playlistData.video_ids || playlistData.videoIds || []
      if (Array.isArray(videoIds)) {
        videoIds = videoIds.join(',')
      }
      
      // Only include Updateable fields
      const updateableData = {
        Name: playlistData.Name || playlistData.name || '',
        Tags: playlistData.Tags || '',
        Owner: playlistData.Owner || null,
        video_ids: videoIds,
        thumbnail: playlistData.thumbnail || '',
        video_count: parseInt(playlistData.video_count) || (Array.isArray(playlistData.videoIds) ? playlistData.videoIds.length : 0)
      }

      const params = {
        records: [updateableData]
      }

      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Playlist created successfully')
          return successfulRecords[0].data
        }
      }

      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating playlist:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async update(recordId, updateData) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      // Only include Updateable fields
      const updateableData = {
        Id: parseInt(recordId)
      }

      // Add only fields that are being updated
      if (updateData.Name !== undefined) updateableData.Name = updateData.Name
      if (updateData.name !== undefined) updateableData.Name = updateData.name
      if (updateData.Tags !== undefined) updateableData.Tags = updateData.Tags
      if (updateData.Owner !== undefined) updateableData.Owner = updateData.Owner
      if (updateData.video_ids !== undefined) {
        updateableData.video_ids = Array.isArray(updateData.video_ids) ? updateData.video_ids.join(',') : updateData.video_ids
      }
      if (updateData.videoIds !== undefined) {
        updateableData.video_ids = Array.isArray(updateData.videoIds) ? updateData.videoIds.join(',') : updateData.videoIds
      }
      if (updateData.thumbnail !== undefined) updateableData.thumbnail = updateData.thumbnail
      if (updateData.video_count !== undefined) updateableData.video_count = parseInt(updateData.video_count)
      if (updateData.videoCount !== undefined) updateableData.video_count = parseInt(updateData.videoCount)

      const params = {
        records: [updateableData]
      }

      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulUpdates.length > 0) {
          toast.success('Playlist updated successfully')
          return successfulUpdates[0].data
        }
      }

      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating playlist:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async delete(recordId) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        RecordIds: [parseInt(recordId)]
      }

      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('Playlist deleted successfully')
          return true
        }
      }

      return false
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting playlist:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return false
    }
  }

  async addVideoToPlaylist(playlistId, videoId) {
    try {
      // First get the current playlist
      const playlist = await this.getById(playlistId)
      if (!playlist) {
        throw new Error('Playlist not found')
      }

      // Parse current video IDs
      let videoIds = []
      if (playlist.video_ids) {
        videoIds = playlist.video_ids.split(',').filter(id => id.trim() !== '')
      }

      // Add video if not already present
      const videoIdStr = videoId.toString()
      if (!videoIds.includes(videoIdStr)) {
        videoIds.push(videoIdStr)
        
        // Update playlist
        const updateData = {
          video_ids: videoIds.join(','),
          video_count: videoIds.length
        }
        
        const result = await this.update(playlistId, updateData)
        if (result) {
          toast.success('Video added to playlist')
        }
        return result
      } else {
        toast.info('Video already in playlist')
        return playlist
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error adding video to playlist:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      toast.error('Failed to add video to playlist')
      return null
    }
  }

  async removeVideoFromPlaylist(playlistId, videoId) {
    try {
      // First get the current playlist
      const playlist = await this.getById(playlistId)
      if (!playlist) {
        throw new Error('Playlist not found')
      }

      // Parse current video IDs
      let videoIds = []
      if (playlist.video_ids) {
        videoIds = playlist.video_ids.split(',').filter(id => id.trim() !== '')
      }

      // Remove video
      const videoIdStr = videoId.toString()
      videoIds = videoIds.filter(id => id !== videoIdStr)
      
      // Update playlist
      const updateData = {
        video_ids: videoIds.join(','),
        video_count: videoIds.length
      }
      
      const result = await this.update(playlistId, updateData)
      if (result) {
        toast.success('Video removed from playlist')
      }
      return result
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error removing video from playlist:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      toast.error('Failed to remove video from playlist')
      return null
    }
  }
}

export const playlistService = new PlaylistService()