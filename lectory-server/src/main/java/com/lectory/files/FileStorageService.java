package com.lectory.files;

import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.stereotype.Service;
import com.mongodb.client.gridfs.model.GridFSFile;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    //Spring Data MongoDB 가 제공하는 GridFS 전용 헬퍼
    private final GridFsTemplate grid;

    /** 저장하고 id 반환 */
    public String store(java.io.InputStream in, String filename, String contentType) {
        ObjectId id = grid.store(in, filename, contentType);
        return id.toHexString(); //URL 경로에 쓰기 쉽도록 문자열 형태로 컨트롤러에 전달
    }

    /** id 로 파일 조회 */
    public GridFsResource get(String id) {
        GridFSFile gf = grid.findOne(
                org.springframework.data.mongodb.core.query.Query.query(
                        org.springframework.data.mongodb.core.query.Criteria.where("_id").is(id)));
        return grid.getResource(gf);
    }
}
