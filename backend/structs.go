package main

import (
	"time"
)

type YouTubeSearch struct{
	Kind          string `firestore:"kind,omitempty"`
	Etag          string `firestore:"etag,omitempty"`
	NextPageToken string `firestore:"nextPageToken,omitempty"`
	RegionCode    string `firestore:"regionCode,omitempty"`
	PageInfo      struct {
		TotalResults   int `firestore:"totalResults,omitempty"`
		ResultsPerPage int `firestore:"resultsPerPage,omitempty"`
	} `firestore:"pageInfo,omitempty"`
	Items []struct {
		Kind string `firestore:"kind,omitempty"`
		Etag string `firestore:"etag,omitempty"`
		ID   struct {
			Kind    string `firestore:"kind,omitempty"`
			VideoID string `firestore:"videoId,omitempty"`
		} `firestore:"id"`
		Snippet struct {
			PublishedAt time.Time `firestore:"publishedAt,omitempty"`
			ChannelID   string    `firestore:"channelId,omitempty"`
			Title       string    `firestore:"title,omitempty"`
			Description string    `firestore:"description,omitempty"`
			Thumbnails  struct {
				Default struct {
					URL    string `firestore:"url,omitempty"`
					Width  int    `firestore:"width,omitempty"`
					Height int    `firestore:"height,omitempty"`
				} `firestore:"default,omitempty"`
				Medium struct {
					URL    string `firestore:"url,omitempty"`
					Width  int    `firestore:"width,omitempty"`
					Height int    `firestore:"height,omitempty"`
				} `firestore:"medium,omitempty"`
				High struct {
					URL    string `firestore:"url,omitempty"`
					Width  int    `firestore:"width,omitempty"`
					Height int    `firestore:"height,omitempty"`
				} `firestore:"high,omitempty"`
			} `firestore:"thumbnails,omitempty"`
			ChannelTitle         string    `firestore:"channelTitle,omitempty"`
			LiveBroadcastContent string    `firestore:"liveBroadcastContent,omitempty"`
			PublishTime          time.Time `firestore:"publishTime,omitempty"`
		} `firestore:"snippet,omitempty"`
	} `firestore:"items,omitempty"`
}


type VideoDuration struct {
	Kind 		string `json:"king,omitempty"`
	Etag 		string `json:"etag,omitempty"`
	Items []struct {
		Kind 		string `json:"king,omitempty"`
		Etag 		string `json:"etag,omitempty"`
		ID 			string `json:"id,omitempty"`
		ContentDetails struct {
			Duration 				string `json:"duration,omitempty"`
			Dimension 				string `json:"dimension,omitempty"`
			Definition 				string `json:"definition,omitempty"`
			Caption 				string `json:"caption,omitempty"`
			LicensedContent 		string `json:"licensedcontent,omitempty"`
			ContentRating struct {}
			Projection 				string `json:"projection,omitempty"`
		}
	}
	PageInfo      struct {
		TotalResults   int `firestore:"totalResults,omitempty"`
		ResultsPerPage int `firestore:"resultsPerPage,omitempty"`
	} `firestore:"pageInfo,omitempty"`
}


type Song struct {
	Title 		string  `firestore:"title,omitempty"`
	Artist 		string  `firestore:"artist,omitempty"`
	Duration 	float64  `firestore:"duration,omitempty"`
	VideoID 	string  `firestore:"videoid,omitempty"`
}

