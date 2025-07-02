import { toast } from 'react-toastify'

class VideoService {
  constructor() {
    this.tableName = 'video'
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
          { field: { Name: "title" } },
          { field: { Name: "thumbnail" } },
          { field: { Name: "video_url" } },
          { field: { Name: "duration" } },
          { field: { Name: "views" } },
          { field: { Name: "upload_date" } },
          { field: { Name: "channel_name" } },
          { field: { Name: "description" } },
          { field: { Name: "likes" } },
          { field: { Name: "dislikes" } },
          { field: { Name: "channel_id" } }
        ],
        orderBy: [
          { fieldName: "upload_date", sorttype: "DESC" }
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
        console.error("Error fetching videos:", error?.response?.data?.message)
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
          { field: { Name: "title" } },
          { field: { Name: "thumbnail" } },
          { field: { Name: "video_url" } },
          { field: { Name: "duration" } },
          { field: { Name: "views" } },
          { field: { Name: "upload_date" } },
          { field: { Name: "channel_name" } },
          { field: { Name: "description" } },
          { field: { Name: "likes" } },
          { field: { Name: "dislikes" } },
          { field: { Name: "channel_id" } }
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
        console.error(`Error fetching video with ID ${recordId}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async create(videoData) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      // Only include Updateable fields
      const updateableData = {
        Name: videoData.Name || videoData.title || '',
        Tags: videoData.Tags || '',
        Owner: videoData.Owner || null,
        title: videoData.title || '',
        thumbnail: videoData.thumbnail || '',
        video_url: videoData.video_url || videoData.videoUrl || '',
        duration: parseInt(videoData.duration) || 0,
        views: parseInt(videoData.views) || 0,
        upload_date: videoData.upload_date || new Date().toISOString(),
        channel_name: videoData.channel_name || videoData.channelName || '',
        description: videoData.description || '',
        likes: parseInt(videoData.likes) || 0,
        dislikes: parseInt(videoData.dislikes) || 0,
        channel_id: parseInt(videoData.channel_id) || parseInt(videoData.channelId) || null
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
          toast.success('Video created successfully')
          return successfulRecords[0].data
        }
      }

      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating video:", error?.response?.data?.message)
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
      if (updateData.Tags !== undefined) updateableData.Tags = updateData.Tags
      if (updateData.Owner !== undefined) updateableData.Owner = updateData.Owner
      if (updateData.title !== undefined) updateableData.title = updateData.title
      if (updateData.thumbnail !== undefined) updateableData.thumbnail = updateData.thumbnail
      if (updateData.video_url !== undefined) updateableData.video_url = updateData.video_url
      if (updateData.videoUrl !== undefined) updateableData.video_url = updateData.videoUrl
      if (updateData.duration !== undefined) updateableData.duration = parseInt(updateData.duration)
      if (updateData.views !== undefined) updateableData.views = parseInt(updateData.views)
      if (updateData.upload_date !== undefined) updateableData.upload_date = updateData.upload_date
      if (updateData.channel_name !== undefined) updateableData.channel_name = updateData.channel_name
      if (updateData.channelName !== undefined) updateableData.channel_name = updateData.channelName
      if (updateData.description !== undefined) updateableData.description = updateData.description
      if (updateData.likes !== undefined) updateableData.likes = parseInt(updateData.likes)
      if (updateData.dislikes !== undefined) updateableData.dislikes = parseInt(updateData.dislikes)
      if (updateData.channel_id !== undefined) updateableData.channel_id = parseInt(updateData.channel_id)
      if (updateData.channelId !== undefined) updateableData.channel_id = parseInt(updateData.channelId)

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
          toast.success('Video updated successfully')
          return successfulUpdates[0].data
        }
      }

      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating video:", error?.response?.data?.message)
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
          toast.success('Video deleted successfully')
          return true
        }
      }

      return false
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting video:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return false
    }
  }

  async search(query) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "title" } },
          { field: { Name: "thumbnail" } },
          { field: { Name: "video_url" } },
          { field: { Name: "duration" } },
          { field: { Name: "views" } },
          { field: { Name: "upload_date" } },
          { field: { Name: "channel_name" } },
          { field: { Name: "description" } },
          { field: { Name: "likes" } },
          { field: { Name: "dislikes" } },
          { field: { Name: "channel_id" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                operator: "OR",
                conditions: [
                  {
                    fieldName: "title",
                    operator: "Contains",
                    values: [query],
                    include: true
                  },
                  {
                    fieldName: "description",
                    operator: "Contains",
                    values: [query],
                    include: true
                  },
                  {
                    fieldName: "channel_name",
                    operator: "Contains",
                    values: [query],
                    include: true
                  }
                ]
              }
            ]
          }
        ],
        orderBy: [
          { fieldName: "views", sorttype: "DESC" }
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
        console.error("Error searching videos:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return []
    }
  }
}

export const videoService = new VideoService()