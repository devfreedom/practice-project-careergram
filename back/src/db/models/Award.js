import { AwardModel } from "../schemas/award";
class Award {
  // Create
  // certDocId 사용하지 않음
  static async create({userId,title,issuer,awardDate,description}) {
    const createdAward = await AwardModel.create({
      userId,
      title,
      issuer,
      awardDate,
      description
    });
    return createdAward;
  }

  // Read
  static async findById({userId}) {
    const filter = {userId: userId};
    const awards = await AwardModel.find(filter);
    return awards;
  }

  // Update
  static async updateOne({awardDocId},newValue) {
    const filter = { _id: awardDocId};
    // _id에 certDocId를 받아옴
    const update = { $set: newValue } ;
    const option = { returnOriginal: false,new:true};
    // 업데이트 되기 이전의 문서는 반환하지 않음
  
    const updatedAward = await AwardModel.findOneAndUpdate(
      filter,
      update,
      option,

    );
    return updatedAward;
  }

  //Delete
  static async deleteOne({awardDocId}) { 
    const filter = { _id: awardDocId};
    const deletedAward=await AwardModel.findOneAndDelete(filter)
    return deletedAward;
  }

}

export { Award };
