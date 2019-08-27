<%@ page language="java"
    contentType="application/vnd.ms-excel; charset=euc-kr"
    pageEncoding="EUC-KR" import="java.util.*"%>
    <%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="java.text.SimpleDateFormat"%>
<%
    SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss", Locale.KOREA);
    String today = format.format(new Date());

    response.setHeader("Content-Type", "application/vnd.ms-xls");
    response.setHeader("Content-Disposition", "attachment; filename=attend_absence_" + today + ".xls");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="ko" style="overflow: hidden">
<head>
<meta http-equiv="content-type" content="text/html; euc-kr" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>엑셀 다운로드</title>
<style>
.table-wrapper-scroll-y {
    display: block;
    max-height: 700px;
    overflow-y: auto;
    -ms-overflow-style: -ms-autohiding-scrollbar;
}
</style>
</head>
<body>
    <table style="background: #ffffff">
        <thead>
            <tr>
	            <th>No</th>
	            <th>고객사명</th>
	            <th>과목</th>
	            <th>강의명</th>
	            <th>강사명</th>
	            <th>신청수강생</th>
	            <th>인정일자</th>  
	            <th>인정사유</th>
	            <th>첨부파일</th>
	            <th>승인/반려일</th>
	            <th>처리상태</th>
	            <th>메모</th>
            </tr>
        </thead>
        <tbody>
        	<c:forEach var="x" items="${list}" varStatus="status">
                <tr>
                    <td>${status.count }</td>
		            <td>${x.compNm}}</td>
		            <td>${x.subjectNmae}</td>  
		            <td>${x.lectureNm}</td>
		            <td>${x.teacherNm}</td>
		            <td>${x.studentNm}</td>  
		            <td>${x.absenceDt}</td>  
		            <td>${x.recognizeCdNm}</td>
		            <td>${x.fileUrl}</td>
		            <td>${x.approveDt}</td>
		            <td>
		            	<c:if test="${x.approveFlag  eq 'R'}">
		            		반려
		            	</c:if>
		            	<c:if test="${x.approveFlag  eq 'S'}">
		            		승인
		            	</c:if>
		            </td>
		            <td>                
		                ${x.approveCnts}
		            </td>  
                </tr>
            </c:forEach>
        </tbody>
    </table>
 
</body>
</html>
