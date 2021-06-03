export type Maybe<T> = T | null;

type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    Date: any;
    DateTime: any;
};

type PageInfoType = {
  hasNextPage: Scalars['Boolean'];
  endCursor: Scalars['String'];
}

//profile

export type ProfileType = {
  id: Scalars['ID'];
  nickname: Scalars['String'];
  user: {
    id: Scalars['ID'];
  };
  teamBoard: TeamBoardType;
  isCoach: Scalars['Boolean'];
  finishedScheduleCount: Scalars['Int'];
  joinAt: Scalars['DateTime'];
  isGuest: Scalars['Boolean'];
}

export type ProfileNodeType = {
  node: ProfileType;
}

export type MyProfileType = {
  myProfile: ProfileType;
}

export type MyTeamMemberType = {
  myTeamMember: {
    edges: Maybe<Array<ProfileNodeType>>;
    pageInfo: PageInfoType;
  }
}

//team

export type TeamType = {
  id: Scalars['ID'];
  name: Scalars['String'];
  password: Scalars['String'];
  isLimitJoin: Scalars['Boolean'];
  teamBoard: TeamBoardType;
}

export type TeamNodeType = {
  node: TeamType;
}

export type OneTeamFromNameType = {
  oneTeamFromName: TeamType;
}

export type OneTeamFromIdType = {
  oneTeamFromId: TeamType;
}

//team-board

export type TeamBoardType = {
  id: Scalars['ID'];
  introduction: Scalars['String'];
  joinCount: Scalars['Int'];
  coach: Scalars['String'];
  team: {
    id: Scalars['ID'];
    name: Scalars['String'];
    password: Scalars['String'];
    isLimitJoin: Scalars['Boolean'];
  }
  schedules: {
    edges:  Maybe<Array<ScheduleNodeType>>;
  }
  trainings: {
    edges: Maybe<Array<TrainingNodeType>>;
  }
}

export type TeamBoardNodeType = {
  node: TeamBoardType;
}

export type AllTeamBoardType = {
  allTeamBoard: {
    edges: Maybe<Array<TeamBoardNodeType>>;
  }
}

//training

export type TrainingType = {
  id: Scalars['ID'];
  title: Scalars['String'];
  count: Scalars['Int'];
  load: Scalars['Int'];
  distance: Scalars['Int'];
  description: Scalars['String'];
  iconNumber: Scalars['Int'];
  finishedSchedules: {
    edges: Maybe<Array<FinishedScheduleNodeType>>
  }
}

export type TrainingNodeType = {
  node: TrainingType;
};

export type SingleTrainingType = {
  training: TrainingType;
}

export type MyTeamTrainingsType = {
  myTeamTrainings: {
    edges: Maybe<Array<TrainingNodeType>>;
  };
};

//schedule 

export type ScheduleType = {
  id: Scalars['ID'];
  date: Scalars['Date'];
  training: TrainingType;
  finishedCount: Scalars['Int'];
  finishedSchedules: {
    edges: Maybe<Array<FinishedScheduleNodeType>>;
  }
}

export type ScheduleNodeType ={
  node: ScheduleType;
}

export type MyTeamSchedulesType = {
  myTeamSchedules: {
    edges: Maybe<Array<ScheduleNodeType>>;
  }
}

//finished-schedule

export type FinishedScheduleType = {
  id: Scalars['ID'];
  schedule: {
    training: {
      id: Scalars['ID'];
    }
    id: Scalars['ID'];
    date: Scalars['Date'];
  }
  profile: {
    id: Scalars['ID'];
    nickname: Scalars['String'];
  }
}

export type FinishedScheduleNodeType = {
  node: FinishedScheduleType;
}

export type MyFinishedSchedulesType = {
  myFinishedSchedules: {
    edges: Maybe<Array<FinishedScheduleNodeType>>;
  }
}

export type MyTeamFinishedSchedulesType = {
  myTeamFinishedSchedules: {
    edges: Maybe<Array<FinishedScheduleNodeType>>;
  }
}


//post

export type PostType = {
  id: Scalars['ID'];
  text: Scalars['String'];
  profile: {
    id: Scalars["ID"];
    nickname: Scalars['String'];
  };
  createdAt: Scalars['DateTime'];
}

export type PostNodeType = {
  node: PostType;
}

export type MyTeamPostsType = {
  myTeamPosts: {
    edges: Maybe<Array<PostNodeType>>;
    pageInfo: PageInfoType;
  }
}
