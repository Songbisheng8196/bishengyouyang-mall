/**
 * 养生课堂相关API
 */
import { get } from '@/utils/request'

export interface Course {
  id: string
  title: string
  coverImage: string
  duration: number
  type: number
  memberLevel?: number
  description: string
  views: number
  createTime: string
}

export interface Article {
  id: string
  title: string
  coverImage: string
  summary: string
  category: string
  author: string
  createTime: string
  readCount: number
}

export async function getCourseList(params: { type?: number; page: number; pageSize: number }): Promise<{ list: Course[]; total: number }> {
  return get('/api/courses', params)
}

export async function getCourseDetail(id: string): Promise<Course & { videoUrl: string; relatedProducts: any[] }> {
  return get(`/api/courses/${id}`)
}

export async function getArticleList(params: { category?: string; page: number; pageSize: number }): Promise<{ list: Article[]; total: number }> {
  return get('/api/articles', params)
}

export async function getArticleDetail(id: string): Promise<any> {
  return get(`/api/articles/${id}`)
}

export async function getFreeCourses(): Promise<Course[]> {
  return get('/api/courses/free')
}

export async function getMemberCourses(memberLevel: number): Promise<Course[]> {
  return get('/api/courses/member', { level: memberLevel })
}

export async function getBundleCourses(): Promise<Course[]> {
  return get('/api/courses/bundle')
}