import { Test, TestingModule } from '@nestjs/testing';
import { ScalingSettingsController } from './scaling-settings.controller';

describe('ScalingSettingsController', () => {
  let controller: ScalingSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScalingSettingsController],
    }).compile();

    controller = module.get<ScalingSettingsController>(ScalingSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
