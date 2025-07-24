package com.lectory.files;

import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.stereotype.Service;
import com.mongodb.client.gridfs.model.GridFSFile;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    // Spring Data MongoDB가 제공하는 GridFS 전용 헬퍼
    private final GridFsTemplate grid;

    /** 파일 저장 후 생성된 ObjectId를 hex 문자열로 반환 */
    public String store(java.io.InputStream in, String filename, String contentType) {
        ObjectId id = grid.store(in, filename, contentType);
        return id.toHexString();
    }

    /** String으로 넘어온 id를 ObjectId로 변환하여 파일 조회 */
    public GridFsResource get(String id) {
        // 1) String → ObjectId 변환
        ObjectId oid = new ObjectId(id);

        // 2) ObjectId로 GridFSFile 검색
        GridFSFile gf = grid.findOne(
                Query.query(Criteria.where("_id").is(oid))
        );

        if (gf == null) {
            throw new RuntimeException("File not found. id=" + id);
        }

        // 3) Resource로 감싸서 반환
        return grid.getResource(gf);
    }
}
