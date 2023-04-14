import { Server } from '@hapi/hapi';
import * as publishedWeekController from './publishedWeekController';
import { createPublishedWeekDto, filterSchema, idDto } from '../../../shared/dtos';

export default function (server: Server, basePath: string) {
  server.route({
    method: "GET",
    path: basePath,
    handler: publishedWeekController.find,
    options: {
      description: 'Get publishedWeeks with filter',
      notes: 'Get all publishedWeeks if filter is not specified.',
      tags: ['api', 'publishedWeek']
    }
  });
  
  server.route({
    method: "GET",
    path: basePath + "/{id}",
    handler: publishedWeekController.findById,
    options: {
      description: 'Get publishedWeek by id',
      notes: 'Get publishedWeek by id',
      tags: ['api', 'publishedWeek'],
      validate: {
        params: idDto
      },
    }
  });
  
  server.route({
    method: "POST",
    path: basePath,
    handler: publishedWeekController.create,
    options: {
      description: 'Create publishedWeek',
      notes: 'Create publishedWeek',
      tags: ['api', 'publishedWeek'],
      validate: {
        payload: createPublishedWeekDto
      },
    }
  });
}