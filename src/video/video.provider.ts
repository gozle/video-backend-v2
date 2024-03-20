
import { Video } from '../models/video.model';


export const VideoProviders = [
    {
        provide: 'VIDEO_REPOSITORY',
        useValue: Video,
    },
];