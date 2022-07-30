import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, pipe } from "rxjs";
import { keys } from "../keys/keys";
import { FbCreateResponse, Post } from "./interfases";

@Injectable({providedIn: 'root'})
export class PostsService {
    constructor(private http: HttpClient) {}

    create(post: Post): Observable<Post> {
        return this.http.post(`${keys.fbDbUrl}/posts.json`, post)
            .pipe(map( (response: FbCreateResponse) => {
                return {
                    ...post,
                    id: response.name,
                    date: new Date(post.date)
                }
            }))
    }

    getAll(): Observable<Post[]> {
        return this.http.get(`${keys.fbDbUrl}/posts.json`)
            .pipe(map( (response: {[key:string]: any}) => {
                return Object
                .keys(response)
                .map( key => ({
                    ...response[key],
                    id: key,
                    date: new Date(response[key].date)
                }))
            }))
    }

    remove(id: string): Observable<void> {
        return this.http.delete<void>(`${keys.fbDbUrl}/posts/${id}.json`)
    }
}