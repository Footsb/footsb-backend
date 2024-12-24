import { Test } from '@nestjs/testing';

import { TeamController } from '../team.controller';
import { TeamService } from '../team.service';
import { TeamListDto } from '../dto/find-all.dto';

describe('🚀 TeamController', () => {
  let teamController: TeamController;
  let teamService: TeamService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [TeamController],
      providers: [
        {
          provide: TeamService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    teamController = module.get<TeamController>(TeamController);
    teamService = module.get<TeamService>(TeamService);
  });

  describe('📌 [GET] findAll', () => {
    test('풋스비에 등록된 팀 목록을 조회할 수 있다!', async () => {
      const mockedTeams: TeamListDto[] = [
        {
          id: 1,
          name: 'test-team1',
          exerciseDays: 'test-exercise-days1',
          exerciseTime: 'test-exercise-time1',
          memberCounts: 12,
          maxMembers: 30,
          isRecruitingMembers: true,
          teamType: 'FOOTBALL',
          genderType: 'MALE',
          createdAt: new Date('2025-01-01'),
        },
        {
          id: 2,
          name: 'test-team2',
          exerciseDays: 'test-exercise-days2',
          exerciseTime: 'test-exercise-time2',
          memberCounts: 22,
          maxMembers: 30,
          isRecruitingMembers: true,
          teamType: 'FOOTBALL',
          genderType: 'MALE',
          createdAt: new Date('2025-01-01'),
        },
        {
          id: 3,
          name: 'test-team3',
          exerciseDays: 'test-exercise-days3',
          exerciseTime: 'test-exercise-time3',
          memberCounts: 12,
          maxMembers: 30,
          isRecruitingMembers: true,
          teamType: 'FOOTBALL',
          genderType: 'MALE',
          createdAt: new Date('2025-01-01'),
        },
      ];

      jest.spyOn(teamService, 'findAll').mockResolvedValue(mockedTeams);
      const result = await teamController.findAll();

      expect(result).toEqual(mockedTeams);
    });

    test('풋스비에 등록된 팀이 없을 경우 빈 배열을 반환한다!', async () => {
      const mockedTeams: TeamListDto[] = [];

      jest.spyOn(teamService, 'findAll').mockResolvedValue(mockedTeams);
      const result = await teamController.findAll();

      expect(result).toEqual(mockedTeams);
    });
  });
});
